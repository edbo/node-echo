When /^I post a valid message to a random channel$/ do
  @current_channel = @uuid.generate
  @current_channel_url = @defaults.get_valid_channel(@current_channel)
  message = { :message => { 'x' => 1 }, :channel_name => @current_channel }.to_json
  @expected_response = Array.new.push(message)
  begin
    @response = RestClient.post @current_channel_url, message, :Authentication => @defaults.get_valid_auth_header(), :content_type => :json
  rescue => e
    @response = e.response
  end
end

Then /^when I get messages from that channel$/ do
  @response = RestClient.get @current_channel_url, {:accept => :json}
end

Then /^receive the same message back$/ do
  @response.should == @expected_response.to_json
end

Then /^post another valid message to the same channel$/ do
  message = { :message => { 'x' => 2 }, :channel_name => @current_channel }.to_json
  @expected_response.push(message)
  begin
    @response = RestClient.post @current_channel_url, message, :Authentication => @defaults.get_valid_auth_header(), :content_type => :json
  rescue => e
    @response = e.response
  end
end

Then /^receive both message back$/ do
  Then "receive the same message back"
end

Given /^two messages already in the channel$/ do
  When "I post a valid message to a random channel"
  Then "post another valid message to the same channel"
end

When /^I get the messages from the channel with a callback set$/ do
  @callback_id = rand(999999999)
  @response = RestClient.get @current_channel_url, {:accept => :javascript, :params => { :callback => @callback_id }}
end

And /^I should receive the messages as a jsonp response$/ do
  puts @response
end