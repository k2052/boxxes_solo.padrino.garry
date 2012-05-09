class Box
  include MongoMapper::Document 
  include Garry::Purchasable   
  
  key :desc,       Text   
  key :short_desc, Text
     
  mount_uploader :file, FileUploader       
  mount_uploader :preview, ImageUploader     
  
  before_save :gen_short_desc      
  
  def gen_short_desc()       
    self[:short_desc] = self[:desc].truncate_char(144) if self[:desc]
  end
end