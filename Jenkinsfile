pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        SLACK_FRONTEND_CHANNEL_ID = credentials('slack-frontend-channel-id')

        // Constants
        DOCKER_PLATFORM = "linux/amd64"
        MAIN_BRANCH = 'main'
        DEPLOY_PROD_BRANCH = 'deploy/production'
    }

    tools {
        nodejs 'nodejs-tool'        // Matches the name from Jenkins Global Tool Config
        dockerTool 'docker-tool'    // Matches the name from Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                sh 'npm run test'
            }
        }

        stage('SonarQube Analysis') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                script {
                    withSonarQubeEnv('sonar-scanner-installation') {
                        sh """
                            ${tool('sonar-scanner-tool')}/bin/sonar-scanner \\
                                -Dsonar.projectKey=ci-todo-frontend \\
                                -Dsonar.sources=. \\
                                -Dsonar.host.url=${SONAR_HOST_URL} \\
                                -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Snyk Security Scan') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                snykSecurity(
                    snykInstallation: 'snyk-tool',
                    snykTokenId: 'snyk-token-id',
                    failOnIssues: false // ideally should be true, but for demo purposes we set it to false
                )
            }
        }

        stage('Build Docker Image') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                sh "docker build --platform \${DOCKER_PLATFORM} -t \${DOCKERHUB_USERNAME}/ci-todo-frontend:\${GIT_COMMIT} ."
            }
        }

        stage('Push Docker Image') {
            when {
                anyOf {
                    branch MAIN_BRANCH
                    branch DEPLOY_PROD_BRANCH
                }
            }
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
                    sh "docker push \${DOCKERHUB_USERNAME}/ci-todo-frontend:\${GIT_COMMIT}"
                }
            }
        }

        stage('Deploy to AWS') {
            when {
                branch DEPLOY_PROD_BRANCH
            }
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ec2-todo-app-ssh-server',
                            transfers: [
                                sshTransfer(
                                    execCommand: """
                                        cd app

                                        # 1. Update .env or environment variables for the new 'green' version
                                        sed -i '/^FRONTEND_GREEN_TAG=/d' .env
                                        echo "FRONTEND_GREEN_TAG=${GIT_COMMIT}" >> .env

                                        # 2. Deploy 'green' service
                                        docker compose pull frontend_green
                                        docker compose up -d frontend_green

                                        # 3. (Optional) Wait or do some quick test or health check on green

                                        # 4. Flip Nginx to green in the config
                                        sed -i 's/set \$active_frontend frontend_blue;/set \$active_frontend frontend_green;/' nginx.conf

                                        # 5. Reload Nginx
                                        docker compose exec nginx nginx -s reload
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
                channel: SLACK_FRONTEND_CHANNEL_ID,
                color: 'danger',
                message: "🚨 Frontend CI pipeline failed for commit \${env.GIT_COMMIT}"
            )
        }
    }
}
