require 'postmark'
require 'mail'
module Jobs
  class SendDownload     
    
    def self.perform(download_id)    
      download = Download.find_by_id(download_id)  
      account  = download.account()      
      
      message = Mail.new do
        to account.email if Padrino.env == :production
        to "bookworm.productions@gmail.com" unless Padrino.env ==:production    
        from ENV['EMAIL']
        subject "Your download is ready!"     
      end

      html_part = Mail::Part.new do
        content_type 'text/html; charset=UTF-8'
        template = Tilt.new(File.expand_path(File.dirname(__FILE__) + '/../../app/views/downloads/email.slim'))
        body template.render(nil, :download => download, :account => account, :box => download.box)
      end

      message.html_part = html_part
      
      begin
        # Postmark.send_through_postmark(message)   
      rescue Exception => e 
        download.sent_download = false
        download.save     
        ::Airbrake.notify(
          :error_class   => :download_send,
          :error_message => "Failed to send email for download #{download.box.title}: #{e.message}",
          :parameters    => {:box => download.box.title, :download => download.id}
        )    
      end
    end
  end
end