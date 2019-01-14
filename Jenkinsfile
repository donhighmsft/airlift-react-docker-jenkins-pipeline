pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  tools {
    nodejs 'node-latest'
  }
  parameters {
    string(name: 'IMAGE_REPO_NAME', defaultValue: 'donghigh/devops-airlift-pipeline-complex', description: '')
    string(name: 'LATEST_BUILD_TAG', defaultValue: 'build-latest', description: '')
    string(name: 'DOCKER_COMPOSE_FILENAME', defaultValue: 'docker-compose.yml', description: '')
    string(name: 'DOCKER_STACK_NAME', defaultValue: 'react_stack', description: '')
    booleanParam(name: 'NPM_RUN_TEST', defaultValue: true, description: '')
    booleanParam(name: 'PUSH_DOCKER_IMAGES', defaultValue: true, description: '')
    booleanParam(name: 'DOCKER_STACK_RM', defaultValue: false, description: 'Remove previous stack.  This is required if you have updated any secrets or configs as these cannot be updated. ')
  }
  stages {
    stage('npm install'){
      steps{
         sh "npm install"
      }
    }
    stage('npm test'){
	    when{
		    expression{
			    return params.NPM_RUN_TEST
		    }
	    }
	steps{
	  sh "npm test -- --coverage"	
	}
    }
    stage('npm build'){
      steps{
        sh "npm run build"
      }
    }
    stage('docker build'){
      environment {
        COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(7)
        BUILD_IMAGE_REPO_TAG = "${params.IMAGE_REPO_NAME}:${env.BUILD_TAG}"
      }
      steps{
        sh "docker build . -t $BUILD_IMAGE_REPO_TAG"
        sh "docker tag $BUILD_IMAGE_REPO_TAG ${params.IMAGE_REPO_NAME}:$COMMIT_TAG"
        sh "docker tag $BUILD_IMAGE_REPO_TAG ${params.IMAGE_REPO_NAME}:${readJSON(file: 'package.json').version}"
        sh "docker tag $BUILD_IMAGE_REPO_TAG ${params.IMAGE_REPO_NAME}:${params.LATEST_BUILD_TAG}"
        sh "docker tag $BUILD_IMAGE_REPO_TAG ${params.IMAGE_REPO_NAME}:$BRANCH_NAME-latest"

      }
    }
    stage('docker push'){
      when{
        expression {
          return params.PUSH_DOCKER_IMAGES
        }
      }
      environment {
        COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(7)
        BUILD_IMAGE_REPO_TAG = "${params.IMAGE_REPO_NAME}:${env.BUILD_TAG}"
        REGISTRY_CREDENTIALS = "airlift-dockerhub"
      }
      steps{
        
        withDockerRegistry([ credentialsId: REGISTRY_CREDENTIALS, url: "" ]) {
         
          sh "docker push $BUILD_IMAGE_REPO_TAG"
          sh "docker push ${params.IMAGE_REPO_NAME}:$COMMIT_TAG"
          sh "docker push ${params.IMAGE_REPO_NAME}:${readJSON(file: 'package.json').version}"
          sh "docker push ${params.IMAGE_REPO_NAME}:${params.LATEST_BUILD_TAG}"
          sh "docker push ${params.IMAGE_REPO_NAME}:$BRANCH_NAME-latest"

        }
       
      }
    }
    stage('Remove Previous Stack'){
      when{
        expression {
	        return params.DOCKER_STACK_RM
        }
      }
      steps{
        sh "docker stack rm ${params.DOCKER_STACK_NAME}"		      
      }
    }
    stage('Docker Stack Deploy'){
      steps{
        sh 'echo "Lets deploy to Swarm or Container"'
        sh "docker stack deploy -c ${params.DOCKER_COMPOSE_FILENAME} ${params.DOCKER_STACK_NAME}"
      }
    }
  }
  post {
    always {
      sh 'echo "Great Deployment of the " ${params.DOCKER_STACK_NAME}'
    }
  }
}
