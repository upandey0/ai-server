const uploadFile= async(req,res)=>{
    try{
    const file= req.file;
    console.log("uploaded file", file.originalname);
    res.status(200).json({message:"file uploaded successfully"});
} 
catch(error){
    console.error('error in uploading file', error);
    res.status(400).json({message:"failed to upload a file"});
}

}