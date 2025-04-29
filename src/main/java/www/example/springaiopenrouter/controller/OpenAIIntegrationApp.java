package www.example.springaiopenrouter.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Map;

@SpringBootApplication
public class OpenAIIntegrationApp {

    public static void main(String[] args) {
        SpringApplication.run(OpenAIIntegrationApp.class, args);
    }

    @Configuration
    @EnableWebMvc
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**").allowedOrigins("http://localhost:3001");
        }
    }

    @RestController
    @RequestMapping("/openai")
    public static class OpenAIController {

        private static final String API_KEY = "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";
        private static final String BASE_URL = "https://openrouter.ai/api/v1";
        private static final String MODEL = "google/gemma-3-27b-it:free";

        private final RestTemplate restTemplate;

        public OpenAIController() {
            this.restTemplate = new RestTemplate();
        }

        @PostMapping("/chat")
        public ResponseEntity<String> chatWithAI(@RequestBody Map<String, String> request) {
            String prompt = request.get("prompt");
            System.out.println("Received prompt: " + prompt); // Optional for debugging

            String response = getAIResponse(prompt);
            if (response != null && !response.isEmpty()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get AI response.");
            }
        }

        public String getAIResponse(String prompt) {
            String url = BASE_URL + "/chat/completions";

            JSONObject requestBody = new JSONObject();
            requestBody.put("model", MODEL);

            JSONObject message = new JSONObject();
            message.put("role", "user");
            message.put("content", prompt);
            requestBody.put("messages", new JSONArray().put(message));

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

                // Log raw response for debugging
                System.out.println("Raw AI Response: " + response.getBody());

                return response.getBody();  // Ensure this response is the full, correct string
            } catch (Exception e) {
                e.printStackTrace();
                return "Error: " + e.getMessage();
            }
        }
    }
}
