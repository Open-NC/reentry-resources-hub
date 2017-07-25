#CentOS deployment script - Reentry Program, Code for NC

###PART 1

#Install EPEL release and perform system update
sudo yum install epel-release -y
sudo yum update -y

#disable SELinux
sudo sed -i 's/enforcing/disabled/g' /etc/selinux/config /etc/selinux/config

#restart server
sudo shutdown -r now
