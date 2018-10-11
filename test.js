const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: 'depk',
    api_secret: '7QO8JSyxyK2nliqsoV70Ca7zyyw',
    api_key: '749142549941399'
}) 

cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/2/21/Sadhguru-Jaggi-Vasudev.jpg", 
  function(error, result) {console.log(result, error)});