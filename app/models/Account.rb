class Account
  include MongoMapper::Document
  include Garry::Account 
  
  def boxes(query={})        
    Box.all({:id => self.purchased_ids}.merge!(query))
  end  
end