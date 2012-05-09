class ImageUploader < CarrierWave::Uploader::Base            
  include CarrierWave::RMagick

  ##
  # Storage type
  #   
  storage :file
  storage :s3 if Padrino.env == :production                   
  
  if Padrino.env == :production   
    configure do |config|         
      config.s3_cnamed            = true
      config.s3_access_key_id     = ENV['S3_ACCESS_KEY']
      config.s3_secret_access_key = ENV['S3_SECRET_ACCESS_KEY']
      config.s3_bucket            = ENV['S3_BUCKET'] 
    end     
  end  
  
  ## Manually set root
  def root; File.join(Padrino.root,"public/"); end

  ##
  # Directory where uploaded files will be stored (default is /public/uploads)
  # 
  def store_dir
    return 'uploads/images' if Padrino.env == :development
    return 'files'          if Padrino.env == :production    
  end

  ##
  # Directory where uploaded temp files will be stored (default is [root]/tmp)
  # 
  def cache_dir
    Padrino.root("tmp")
  end
  
  process :resize_to_fit => [1200, 1200]

  version :thumb do      
    process :resize_to_fill => [240,192]
  end 
  
  # White list of extensions which are allowed to be uploaded:
  # 
  def extension_white_list
    %w(jpg jpeg gif png)
  end
end