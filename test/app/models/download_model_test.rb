require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "Download Model" do   
  setup do    
    @download_account = Account.first(:last_4_digits.ne => nil)
    @box = Box.first()
  end            

  should "create a download and send a download link" do    
    download = Download.new(:box_id => @box.id, :account_id => @download_account.id)  
    assert download.save      
    download = Download.find_by_id(download.id)
    assert download.sent_download == true
  end
end