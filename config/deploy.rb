require 'mina/rails'
require 'mina/git'

set :application_name, 'vue-timebot'
set :domain, '172.104.151.14'
set :user, 'dev'
set :deploy_to, "/home/dev/www/#{fetch(:application_name)}"
set :repository, 'git@gitlab.codica.com:codica2/vue-timebot.git'
set :branch, 'master'

# Put any custom commands you need to run at setup
# All paths in `shared_dirs` and `shared_paths` will be created on their own.
task :setup do
  # command %{rbenv install 2.3.0 --skip-existing}
end

desc "Deploys the current version to the server."
task :deploy do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:cleanup'

    on :launch do
      in_path(fetch(:current_path)) do
        command %{yarn install}
        command %{yarn build}
      end
    end
  end
end

