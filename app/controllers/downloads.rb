Boxxes.controllers :downloads do  
  get :show, :map => '/downloads/:id' do   
    @download = Download.find_by_id(params[:id]) 
    if @download and @download.expires_at > Time.now 
      send_file @download.box.file.current_path 
    else
      halt 403, 'You do not have permissions to access this download.'
    end
  end              
end