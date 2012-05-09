class Download    
  include MongoMapper::Document  
  attr_accessor :resend_download, :dont_send_download  
  
  key :expires_at,    Time
  key :box_id,        ObjectId  
  key :account_id,    ObjectId  
  key :sent_download, Boolean     
  
  before_save :gen_expires_at    
  after_save :send_download_link, :if => :send_download?
  
  def gen_expires_at()   
    self[:expires_at] = Chronic.parse('5 days from now')
  end
  
  def box()  
    Box.find_by_id(self.box_id)
  end  
  
  def send_download_link() 
    self.sent_download = true
    self.save       
    return Jobs::SendDownload::perform(self.id) if Padrino.env == :development or Padrino.env == :test   
    Resque.enqueue(Jobs::SendDownload, self.id)
  end 
  
  def send_download?()     
    return false if self.sent_download and !@resend_download or @dont_send_download   
    return true
  end   
  
  def account() 
    Account.find_by_id(self.account_id)
  end
end