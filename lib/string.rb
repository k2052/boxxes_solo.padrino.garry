class String    
  def possessive
    self + ('s' == self[-1,1] ? "'" : "'s")
  end 
  
  # Truncates a string 
  def truncate(length = 30, end_string = '...')
    return self if self == nil
    words = self.split()
    words[0..(length-1)].join(' ') + (words.length > length ? end_string : '')
  end  
  
  def truncate_char(length = 30, end_string = '...')
    string = self.slice(0, length) 
    string << '...' if self.length > length  
    string
  end
end