# OSLO-Contributors

This repository contains software to create statistics about the OSLO standards and its contributors. It expects a JSON file as input with the following properties:
```
[
  {
    "naam" : "...",
    "stakeholders" : "..."
  },
  ...
]
```

`naam` contains the name of the standard of which the statistics will be created, whereas `stakeholders` is a report of the specification of this standard after it was processed by the Toolchain. These reports can be found in 
the repository [OSLO-Generated](https://github.com/Informatievlaanderen/OSLO-Generated).

Every object will then be processed by this software and an output file will be created. This output file is used by the 
[OSLO-StandaardenregisterGenerated](https://github.com/Informatievlaanderen/OSLO-StandaardenregisterGenerated) repository to display these statistics on the website.
