require 'ffaker'

shell.say "Creating some boxes. 20 to be exact"

20.times do |i|     
  box = Box.new(:title => Faker::Lorem.words(3).join(" "), :price => Random.rand(4200-100) + 100, :desc => Faker::Lorem.paragraphs(2).join(" "))
  box.file = File.open(File.expand_path(File.dirname(__FILE__) + '/../test/data/demo.zip'))
  box.save   
end                 

shell.say "Creating some accounts. 5 to be exact"

5.times do |i|    
  account = Account.new(:email => Faker::Internet.email, :username => Faker::Internet.user_name, :name => Faker::Name.name, :password => 'testpass', 
    :password_confirmation => 'testpass')    
  account.save 
       
  account = Account.find_by_id(account.id)  
  card = {
    :number    => 4242424242424242,
    :exp_month => 8,
    :exp_year  => 2013
  } 
  account.update_stripe(:card => card)
end  

shell.say "Purchasing some boxes"

boxes = Box.all(:limit => 4)     
account = Account.no_purchases.first(:last_4_digits.ne => nil) 
boxes.each do |box|      
  account.purchase(box)
end  