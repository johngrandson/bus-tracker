import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 50 }, // Start with 50 VUs
    { duration: "20s", target: 200 }, // Maintain 200 VUs for 20 seconds
    { duration: "20s", target: 0 }, // Scale down. VUs should reach zero
  ],
};

export default function () {
  const payload = JSON.stringify({
    userId: "150049ac-5098-4232-a1a7-563131f1c595",
    totalAmount: 100,
  });

  const headers = { "Content-Type": "application/json" };
  const res = http.post("http://localhost:3000/payments/create", payload, {
    headers,
  });

  check(res, {
    "is status 200": (r) => r.status === 201,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1); // Wait 1 second between requests
}
