Steps for executing deployment scripts:

1) Connect via ssh to newly created EC2 instance
2) add ssh public key of CentOS instance to github
2) sudo yum -y install git
3) sudo git clone https://github.com/giancarlopetrini/reentry-resources-hub.git /opt/reentry-resources-hub
4) sudo chmod +x /opt/reentry-resources-hub/deployment/reentry-deployment-script.sh /opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
5)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script.sh
6) Reconnect to server after reboot, via ssh
6)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script2.sh
