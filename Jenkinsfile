pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
    }

    tools {
        nodejs 'nodejs-tool' // Match the name you set in NodeJS configuration
        dockerTool 'docker-tool' // Match the name you set in Docker configuration
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/FH-Technikum-Wien-Ruslan-Kotliarenko/ci-todo-frontend'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script { 
                    withSonarQubeEnv('sonar-scanner-installation') {
                        sh "${tool('sonar-scanner-tool')}/bin/sonar-scanner \
                            -Dsonar.projectKey=ci-todo-frontend \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_TOKEN}"
                    }
                }
            }
        }
        stage('Snyk Security Scan') {
            steps {
                echo 'Testing...'
                snykSecurity(
                    snykInstallation: 'snyk-tool',
                    snykTokenId: 'snyk-token-id',
                    failOnIssues: false // ideally should be true, but for demo purposes we set it to false
                )
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build --platform linux/amd64 -t ruslankotliar/ci-todo-frontend:${GIT_COMMIT} ."
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
                    sh "docker push ruslankotliar/ci-todo-frontend:${GIT_COMMIT}"
                }
            }
        }
        stage('Deploy to AWS') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2-todo-app-ssh-server',
                            transfers: [
                                sshTransfer(
                                    execCommand: """
                                        cd app
                                        sed -i '/^FRONTEND_TAG=/d' .env  # Remove existing FRONTEND_TAG if present
                                        echo "FRONTEND_TAG=${GIT_COMMIT}" >> .env  # Add or update FRONTEND_TAG
                                        docker compose pull frontend
                                        docker compose up -d frontend
                                    """
                                )
                            ],
                            usePromotionTimestamp: false,
                            verbose: true
                        )
                    ]
                )
            }
        }

        // Uncomment the following stage to test the failure notification
        // stage('Test Failure') {
        //     steps {
        //         sh 'exit 1' // Any non-zero exit code will fail the pipeline
        //     }
        // }
    }

    post {
        failure {
            slackSend (
                channel: '#frontend',
                color: 'danger',
                message: "Frontend CI pipeline failed for commit ${env.GIT_COMMIT}"
            )
        }
    }
}
