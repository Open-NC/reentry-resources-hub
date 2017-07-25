#CentOS deployment script - Reentry Program, Code for NC

####PART 2

#install dependencies and nginx
sudo yum -y install gcc-c++ make nginx wget

#download and run Node v8 installation files, add yarn repo
sudo curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo yum -y install nodejs yarn

#start nginx
sudo systemctl start nginx

#allow web traffic through firewall
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

#start nginx at boot
sudo systemctl enable nginx

#reverse proxy settings into nginx vanilla config, via nginx.conf prepped file
#(no sub-domian routing options specified as of yet)

#create backup of original
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
#copy new config file(s)
cp /opt/reentry-deployment/nginx.conf /etc/nginx/nginx.conf
#restart nginx
sudo systemctl restart nginx

#clone repos into /opt/
cd /opt
git clone https://github.com/CodeForNC/reentry-admin-ui.git
git clone https://github.com/CodeForNC/reentry-admin-api.git
git clone https://github.com/CodeForNC/nc-reentry-resources-content.git
#run yarn in each repo
cd nc-reentry-resources-content && yarn && cd ..
cd reentry-admin-api && yarn && cd ..
cd reentry-admin-ui && yarn && cd ..
cd reentry-resources-hub && yarn global add forever && yarn && yarn start
#run app under forever manager
##TODO
#forever start -c "yarn start" /opt/reentry-resources-hub/package.json
