$wrapperUrl = "https://github.com/gradle/gradle/raw/master/gradle/wrapper/gradle-wrapper.jar"
$outputPath = "C:\Users\jgkin\IdeaProjects\Meal Mate\android\gradle\wrapper\gradle-wrapper.jar"

Invoke-WebRequest -Uri $wrapperUrl -OutFile $outputPath

Write-Host "Downloaded gradle-wrapper.jar to $outputPath"