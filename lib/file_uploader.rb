class FileUploader < CarrierWave::Uploader::Base            

  ##
  # Storage type
  #   
  storage :file
  
  ## Manually set root
  def root; File.join(Padrino.root,"public/"); end

  ##
  # Directory where uploaded files will be stored (default is /public/uploads)
  # 
  def store_dir
    return 'uploads/downloads' if Padrino.env == :development
    return 'files/downloads'   if Padrino.env == :production    
  end

  ##
  # Directory where uploaded temp files will be stored (default is [root]/tmp)
  # 
  def cache_dir
    Padrino.root("tmp")
  end
  # White list of extensions which are allowed to be uploaded:
  # 
  def extension_white_list
    %w(zip rar)
  end
end