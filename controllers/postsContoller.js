
export const createPosts = async (req, res, next) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error creating posts",
            error : error.message 
        })
    }
}
