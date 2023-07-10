package com.example.pushapp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegChecker {

static public boolean checkPattern (String input, String pattern ) {
    Pattern regexPattern = Pattern.compile(pattern);
    Matcher matcher = regexPattern.matcher(input);
    return matcher.matches();
    }
}
