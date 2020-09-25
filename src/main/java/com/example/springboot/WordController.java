package com.example.springboot;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/pyramid")
public class WordController {
	@PostMapping("/word")
	public String checkIsPyrmaidWord(@RequestBody String word) {
		// convert the word in a occurrence map
		Map<Character, Integer> frequencies = word.chars().boxed()
		        .collect(Collectors.toMap(
		                k -> Character.valueOf((char) k.intValue()),		// key = char
		                v -> 1,												// 1 occurrence
		                Integer::sum));										// counting

		System.out.println("Frequencies:\n" + frequencies);

		// sort the map by value as a stream and iterate to check for proper sequencing
		Stream<Map.Entry<Character, Integer>> sorted2 = frequencies.entrySet().stream()
				   .sorted(Map.Entry.comparingByValue());

		int number = 0;
		boolean isPyramidWord = true;
		Iterator<Map.Entry<Character, Integer>> iterator = sorted2.iterator();
		while (iterator.hasNext()) {
			number++;
			Map.Entry<Character, Integer> entry = iterator.next();
			if (entry.getValue() != number) {
				isPyramidWord = false;
				break;
			}
		}

		String response = String.format("'%s' is %sa pyramid word.", word, (isPyramidWord ? "":"not "));
		return response;
	}

	@GetMapping("/test")
	public String test() {
		System.out.println("test called...");
		return "test succeeded.";
	}
}
