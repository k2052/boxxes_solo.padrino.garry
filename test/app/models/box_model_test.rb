require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "Box Model" do
  setup do   
    @box_account = Account.first(:last_4_digits.ne => nil) 
  end   

  should "create and buy a box" do      
    box = Box.new(:title => Faker::Lorem.words(3).join(" "), :price => Random.rand(4200-100) + 100, :desc => Faker::Lorem.paragraphs(2).join(" "))
    box.file = File.open(File.expand_path(File.dirname(__FILE__) + '/../../data/demo.zip'))      
    assert box.save 
    
    @box_account.purchase(box)  
     
    @box_account = Account.find_by_id(@box_account.id)   
    assert @box_account.purchased?(box) == true    
    assert @box_account.purchased_type == box.class.to_s
  end    
end