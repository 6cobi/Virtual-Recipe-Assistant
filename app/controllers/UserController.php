<?php

namespace app\controllers;
use app\models\User;

class UserController extends Controller {
    public function getUsers() {
        $userModel = new User();
        $users = $userModel->getAllUsers();
        $this->returnJSON($users);
        exit();
    }

    public function usersView() {
        $this->returnView('./assets/views/users/usersView.html');
    }

    public function getHisTorySearch() {
        $userModel = new User();
        $users = $userModel->getAllUsers();
        $this->returnJSON($users);
        echo json_encode($users);
        exit();
    }
    
    public function setHisTorySearch() {
        $inputData = json_decode(file_get_contents('php://input'), true);
    
        if (!isset($inputData['content']) || !$inputData['content']) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
            ]);
            exit();
        }
    
        $post = new User();
        $post->savePost(
            [
                'content' => $inputData['content'],
            ]
        );
    
        http_response_code(200);
        echo json_encode([
            'success' => true
        ]);
        exit();
    }    

    public function processChatRequest() {
        $inputData = json_decode(file_get_contents('php://input'), true);
    
        if (!isset($inputData['message']) || !$inputData['message']) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Message is required.'
            ]);
            exit();
        }
    
        $apiKey = OPENAI_API_KEY;    
        
        $chatRequest = [
            "model" => "gpt-4o-mini",
            "messages" => [
                [
                    "role" => "user",
                    "content" => "This is a recipe app where user input what they have for ingredients then you recommend one easy dish. Each instruction should be in separated new line paragraphs with no bulletpoints. You've got " . $inputData['message'] . " ingredients. Specify what I can make. Please give me the step-by-step, as well as any recommended ingredients I might be able to add. Add cute emojis for the response. If someone inputs inappropriate or invalid items (like cats, dogs, shit), politely ask them to use valid ingredients instead."
                ]
            ],
            "temperature" => 0.7
        ];
    
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.openai.com/v1/chat/completions",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($chatRequest),
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $apiKey",
                "Content-Type: application/json"
            ]
        ]);
    
        $response = curl_exec($curl);
        curl_close($curl);
    
        if ($response === false) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to connect to ChatGPT API.'
            ]);
            exit();
        }
    
        $responseData = json_decode($response, true);
        if (!isset($responseData['choices'][0]['message']['content'])) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid response from ChatGPT API.'
            ]);
            exit();
        }
    
        echo json_encode([
            'success' => true,
            'response' => $responseData['choices'][0]['message']['content']
        ]);
        exit();
    }
    
    
}

