pipeline {
    agent any
    environment {
        DEPLOY_HOST = '54.90.166.246'
        SSH_USER = 'ec2-user' // Change if your user is different
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
                        sh '''
                            echo "Installing SonarQube Scanner locally..."
                            npm install sonarqube-scanner --no-save
                            echo "Running SonarQube Analysis..."
                            npx sonar-scanner \
                              -Dsonar.projectKey=my-project \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=http://54.90.166.246:9001 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
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
                expression { return false }
            }
            steps {
                echo 'Push to Docker registry here if needed.'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                scp -i $SSH_KEY -o StrictHostKeyChecking=no docker-compose.yml $SSH_USER@$DEPLOY_HOST:~/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r server/ $SSH_USER@$DEPLOY_HOST:~/server/
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r client/ $SSH_USER@$DEPLOY_HOST:~/client/
                '''
                sh '''
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SSH_USER@$DEPLOY_HOST \
                'cd ~ && docker-compose down && docker-compose up -d --build'
                '''
            }
        }
    }
}
