Steps for executing deployment scripts once connected to CentOS 7 EC2 on AWS:

1) yum -y install git
2) cd /opt && git clone https://github.com/giancarlopetrini/reentry-resources-hub.git
3) chmod +x /opt/reentry-resources-hub/deployment/reentry-deployment-script.sh /opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
4)/opt/reentry-resources-hub/deployment/./reentry-deployment-script.sh
5)/opt/reentry-resources-hub/deployment/./reentry-deployment-script2.sh
