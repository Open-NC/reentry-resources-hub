Steps for executing deployment scripts:

<<<<<<< HEAD
1) Connect via ssh to newly created EC2 instance
2) add ssh public key of CentOS instance to github
2) sudo yum -y install git
3) sudo git clone https://github.com/giancarlopetrini/reentry-resources-hub.git /opt/reentry-resources-hub
4) sudo chmod +x /opt/reentry-resources-hub/deployment/reentry-deployment-script.sh /opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
5)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script.sh
6) Reconnect to server after reboot, via ssh
6)sudo /opt/reentry-resources-hub/deployment/./reentry-deployment-script2.sh
=======
1) yum -y install git
2) cd /opt && git clone https://github.com/giancarlopetrini/reentry-resources-hub.git
3) chmod +x /opt/reentry-resources-hub/deployment/reentry-deployment-script.sh /opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
4)./opt/reentry-resources-hub/deployment/reentry-deployment-script.sh
5)./opt/reentry-resources-hub/deployment/reentry-deployment-script2.sh
>>>>>>> d164f39ff63fdd86e91afc1b66f6268cc4e3fa70
