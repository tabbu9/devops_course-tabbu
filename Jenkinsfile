pipeline {
    agent any
    environment {
        DEPLOY_HOST = '54.90.166.246'
        SSH_USER = 'ec2-user' // Change if your user is different
        // Add path to your SSH key in Jenkins credentials
        SSH_KEY = credentials('ec2-ssh-key')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonarQubeServer') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh 'npm install -g sonarqube-scanner' // or use local scanner if preferred
                        sh 'sonarqube-scanner -Dsonar.login=$SONAR_TOKEN'
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Push Images (optional)') {
            when {
                expression { return false } // Set to true if using a registry
            }
            steps {
                echo 'Push to Docker registry here if needed.'
            }
        }
        stage('Deploy to EC2') {
            steps {
                // Copy files to EC2
                sh '''
                scp -i $SSH_KEY -o StrictHostKeyChecking=no docker-compose.yml $SSH_USER@$DEPLOY_HOST:~/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r server/ $SSH_USER@$DEPLOY_HOST:~/server/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r client/ $SSH_USER@$DEPLOY_HOST:~/client/
                '''
                // SSH and deploy
                sh '''
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$DEPLOY_HOST \
                'cd ~ && docker-compose down && docker-compose up -d --build'
                '''
            }
        }
    }
}
