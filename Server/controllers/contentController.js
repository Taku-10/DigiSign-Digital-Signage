require("dotenv").config();
const Content = require("../models/Content");
const Screen = require("../models/Screen");
const { cloudinary } = require('../cloudinary/index');
const { Console } = require("console");
const { storage } = require('../cloudinary/index'); // Import the 'storage' object
// const multer = require('multer');
// const upload = multer({ storage });
class contentController {
  static async addContentToScreen(screenId, content) {
    // Extract data from the request body
    // const { slideTitle, post } = req.body; // Remove 'image' since it will be handled by multer

    // Use the 'upload' middleware for file uploads
    // upload.single('image')(req, res, async (error) => {
    //   if (error) {
    //     console.error(error);
    //     return res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    //   }
    //   else { }

    //   // The rest of your code for handling the uploaded file...
    // });



    // const result = await cloudinary.uploader.upload(image, {
    //   folder: "digiSign",
    //   // width: 300,
    //   // crop: "scale"
    // })

    // The file has been successfully uploaded to Cloudinary,
    // and you can access its details in 'req.file'.
    // For example, you can get the public ID and secure URL like this:
    // console.log(req.file)
    // const imagePublicId = req.file.public_id;
    // const imageUrl = req.file.secure_url;

    // const screenId = req.params.screenId;
    // console.log("imageId", imagePublicId);


    // const contentData = {
    //   slideTitle,
    //   post,
    //   screen: screenId,
    //   image: {//added this
    //     public_id: uploadedFile.public_id,
    //     url: uploadedFile.secure_url
    //   }
    // }

    // console.log(req.user);
    // const contentData = {

    // Create a new Content instance with the content data
    // const content = new Content(contentData);
    // // Save the new content to the database
    // const savedContent = await content.save();
    // // Update the Screen document to include the new content's ID
    // await Screen.findByIdAndUpdate(screenId, {
    //   $push: { content: savedContent._id },
    // });

    // res.json(savedContent);
  }

  static async deleteContent(req, res) {
    const { contentId } = req.params;
    // Find the content by its ID
    const content = await Content.findById(contentId);
    if (!content) {
      res.status(400).json({ Error: "Content not found" });
    }
    // Get the screen ID associated with the content
    const screenId = content.screen;
    // Remove the content ID from the associated screen
    await Screen.findByIdAndUpdate(screenId, {
      $pull: { content: contentId },
    });
    res.json({ message: "Content deleted successfully" });
  }

  static async editContent(req, res) {
    const { contentId } = req.params;
    // Extract content data from the re.body
    const { slideTitle, post, imageUrl } = req.body;
    // Find the content by its ID
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    // Update the content's properties with the provided data
    content.slideTitle = slideTitle;
    content.post = post;
    content.imageUrl = imageUrl;
    // Save the updated content
    const updatedContent = await content.save();
    res.json(updatedContent);
  }

  static async showAScreenScontent(req, res) {
    const { screenId } = req.params;
    // Find the screen by its ID and populate its content field
    const screen = await Screen.findById(screenId).populate("content");
    if (!screen) {
      return res.status(404).json({ Error: "Screen not found***" });
    }
    res.json(screen.content);
  }

  static async showDetailedContent(req, res) {
    const { contentId } = req.params;
    // Find the content by its ID
    const content = await Content.findById(contentId);
    if (!content) {
      res.status(404).json({ error: "Content not found" });
    }
    res.json(content);
  }
}

module.exports = contentController;
