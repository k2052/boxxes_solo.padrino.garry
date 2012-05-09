require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "DownloadsController" do
  
  context "normal" do 
    setup do 
      header 'Accept', 'text/html'     
      header 'Content-Type', 'text/html'  
    end
    
    should "retrieve a download" do 
      download = Download.first()       
      get "/downloads/#{download.id}"   
      assert last_response.status == 200
    end
  end
end