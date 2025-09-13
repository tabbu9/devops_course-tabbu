pipeline {
    agent any
    environment {
        DEPLOY_HOST = '54.90.166.246'   // Your EC2 deployment target
        SSH_USER = 'ec2-user'           // Update if different
        SSH_KEY = credentials('ec2-ssh-key') // Jenkins SSH key credential
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
                        sh '''
                            echo "Installing SonarQube Scanner locally..."
                            npm install sonarqube-scanner --no-save
                            echo "Running SonarQube Analysis..."
                            npx sonar-scanner \
                              -Dsonar.projectKey=my-project \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=http://54.90.166.246:9001 \
                              -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Push Images (optional)') {
            when {
                expression { return false } // Change to true if pushing to DockerHub/registry
            }
            steps {
                echo 'Push to Docker registry here if needed.'
            }
        }

        stage('Deploy to EC2') {
            steps {
                // Copy files to remote EC2
                sh '''
                scp -i $SSH_KEY -o StrictHostKeyChecking=no docker-compose.yml $SSH_USER@$DEPLOY_HOST:~/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r server/ $SSH_USER@$DEPLOY_HOST:~/server/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r client/ $SSH_USER@$DEPLOY_HOST:~/client/
                '''
                // SSH into EC2 and restart containers
                sh '''
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$DEPLOY_HOST \
                'cd ~ && docker compose down && docker compose up -d --build'
                '''
            }
        }
    }
}
