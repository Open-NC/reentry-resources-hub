Steps for executing deployment scripts once connected to CentOS 7 EC2 on AWS:

1)sudo  yum -y install git
2)sudo cd /opt && sudo git clone https://github.com/giancarlopetrini/reentry-resources-hub.git
3) sudo chmod +x /opt/reentry-resources-hub/deployment/reentry-deployment-script.sh /opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
4)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script.sh
5)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script2.sh

*Step 2 clone URL will change when Pull Request merged*
