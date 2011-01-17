When /^I post a valid message to a random channel$/ do
  channel = @uuid.generate
  @current_channel = @defaults.get_valid_channel(channel)
  @message = { :message => { 'x' => 1 }, :channel_name => channel }.to_json
  begin
    @response = RestClient.post @current_channel, @message, :Authentication => @defaults.get_valid_auth_header(), :content_type => :json
  rescue => e
    @response = e.response
  end
end

Then /^when I get messages from that channel$/ do
  @response = RestClient.get @current_channel, {:accept => :json}
end

Then /^receive the same message back$/ do
  @response.should == @message
end