package main

import (
	"fmt"
	"os"
	"os/exec"
)

var filepaths []string = []string{
	"/root/2022-ma-paul-pongratz/code/scripts/dave/read_cattlegps.go",
	"/root/2022-ma-paul-pongratz/code/scripts/dave/reformat_cattlegps.go",
	"/root/2022-ma-paul-pongratz/code/scripts/dave/count_and_print_reformatted_unique_gps_values.go",
	"/root/2022-ma-paul-pongratz/code/scripts/dave/Create_Sensors.go",
}

func main() {
	// Define a slice of file paths to execute

	// Loop through each file path and execute the file
	for _, filepath := range filepaths {
		// Create a new command to execute the file
		cmd := exec.Command("go", "run", filepath)

		// Set the command's standard output and error to the console
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		// Execute the command and wait for it to finish
		err := cmd.Run()
		if err != nil {
			fmt.Printf("Error executing %s: %s\n", filepath, err)
			return
		}
	}

	fmt.Println("All files executed successfully!")
}
