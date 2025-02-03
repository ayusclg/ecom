import { User } from "../models/user.models.js";

const generateAccessAndRefreshToken = async function(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return null; // or throw an error
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refresh_token = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log('Error occurred in generating token:', error);
        return null; // handle error appropriately
    }
};

const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const photourl = req.file ? `public/images/${req.file.filename}` : "";

        const user = await User.create({
            username,
            email,
            password,
            avatar: photourl
        });

        const createdUser = await User.findById(user._id).select("-password -refresh_token");
        if (!createdUser) {
            console.log('Error occurred in creating user');
            return res.status(500).json({
                message: "User not created"
            });
        }

        return res.status(201).json({
            message: "User created successfully",
            data: createdUser
        });
    } catch (error) {
        console.log('Error in registering:', error);
        return res.status(500).json({
            message: "User not registered"
        });
    }
};

const userLogin = async function(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) {
            console.log('Email is required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User does not exist');
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(404).json({
                message: 'Invalid credentials'
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        if (!accessToken || !refreshToken) {
            return res.status(500).json({
                message: 'Failed to generate tokens'
            });
        }

        const loggedUser = await User.findById(user._id).select("-password -refresh_token");

        const options = {
            httpOnly: true,
            secure: true
        };

        res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: 'User logged in successfully',
                data: loggedUser
            });
    } catch (error) {
        console.log('Error in login:', error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const userLogout = async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refresh_token: undefined
        }
      },
      {
        new: true
      }
    )
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "User LoggedOut Successfully"
      })
  }
export { userRegister, userLogin,userLogout };
