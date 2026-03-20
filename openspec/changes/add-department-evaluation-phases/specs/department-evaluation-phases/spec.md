## ADDED Requirements

### Requirement: Department Has Ordered Phases

The system MUST support defining an ordered list of phases under each department.

#### Scenario: Configure ordered phases for a department

- **WHEN** a department is configured with multiple phases
- **THEN** phases have a deterministic order
- **AND** the UI renders phases in that order

### Requirement: Department List And Phase Plan Configuration

The system MUST maintain a department list (seeded with built-in departments) as the source of truth for warehouse departments, and MUST allow adding departments and configuring per-department phase ordering.

#### Scenario: Configure phases for an existing department

- **GIVEN** the system has a seeded list of departments
- **WHEN** the user opens the department configuration page and selects a department
- **THEN** the user can pick phase templates and reorder them for that department
- **AND** the system persists the department's phase plan in the front-end data layer

#### Scenario: Create a new department

- **WHEN** the user creates a department with `name`, `code`, and `owner`
- **THEN** the system persists the department in the front-end data layer
- **AND** the department becomes available anywhere a department selection is required

### Requirement: Department Total Score And Grade

The system MUST compute a department total score and grade for an evaluation based on per-phase scores.

#### Scenario: Compute department score as average of phase scores

- **GIVEN** an evaluation has per-phase scores for the department's ordered phases
- **WHEN** the system renders the evaluation detail or report summary
- **THEN** `departmentScore` equals the arithmetic mean of the phase scores
- **AND** `departmentScore` is constrained to `0..100`

#### Scenario: Compute department grade using existing grade levels

- **GIVEN** `departmentScore` is computed
- **WHEN** the system renders the department grade
- **THEN** `departmentGrade` is derived using the system's existing grade thresholds (`gradeLevels`)

### Requirement: Evaluation Requires Department Has Phases Configured

The system MUST prevent starting an evaluation if the selected department has no configured phases, and MUST NOT generate an evaluation report in that case.

#### Scenario: Department has no phases configured

- **GIVEN** a department exists
- **AND** the department has no configured phases in its phase plan
- **WHEN** the user attempts to start an evaluation for a warehouse in that department
- **THEN** the system blocks the action with a clear message
- **AND** no evaluation record is created

### Requirement: Phase Template Management

The system MUST provide a phase template list page and a phase template creation page.

#### Scenario: View phase template list

- **WHEN** the user opens the phase template list page
- **THEN** the system displays existing phase templates with name and description

#### Scenario: Create a new phase template

- **WHEN** the user submits a new phase template with name and description
- **THEN** the system persists the template in the front-end data layer
- **AND** the template becomes available for department phase ordering

### Requirement: Phase Form Schema Builder

The system MUST allow configuring common form components in the phase creation page.

#### Scenario: Add a text field

- **WHEN** the user adds a text field component in a phase template
- **THEN** the form schema stores a `type='text'` field with label and required flag

#### Scenario: Add a select field

- **WHEN** the user adds a select field component with options
- **THEN** the form schema stores a `type='select'` field with options

#### Scenario: Add an attachment field

- **WHEN** the user adds an attachment field component
- **THEN** the form schema stores a `type='attachment'` field

### Requirement: Evaluation Stores Per-Phase Score

The system MUST store per-phase scores for an evaluation, with each phase score having a maximum of 100.

#### Scenario: Save phase scores

- **WHEN** an evaluation is saved with per-phase scores
- **THEN** each score is constrained to `0..100`
- **AND** the evaluation detail view displays each phase score

### Requirement: Department Phase Configuration Binds Multiple Rules

The system MUST allow configuring multiple rule bindings for each phase in a department's phase plan for scoring purposes.

#### Scenario: Bind rules to a phase

- **WHEN** the user configures a department phase plan and sets rule bindings for a phase
- **THEN** the system stores an ordered or unordered list of bound rules for that department phase
- **AND** the phase can have more than one bound rule

### Requirement: Compute Phase Score As Average Of Rule Scores

When a phase uses rule-based scoring, the system MUST compute the phase score as the average of the bound rule scores.

#### Scenario: Compute average score

- **GIVEN** a phase uses rule-based scoring
- **AND** the phase has multiple bound rules
- **AND** each bound rule has a score constrained to `0..100`
- **WHEN** the evaluation is saved or viewed
- **THEN** the phase score equals the arithmetic mean of the rule scores
- **AND** the computed phase score is constrained to `0..100`

### Requirement: Manual Entry Of Rule Scores For rules_avg

In `rules_avg` scoring mode, the system MUST support manually entering scores for each bound rule (in `0..100`) and using those scores as input to the phase average computation.

#### Scenario: Enter rule scores and compute phase score

- **GIVEN** a phase uses `rules_avg` scoring
- **AND** the phase has 2 or more bound rules
- **WHEN** the user enters a score for each bound rule
- **THEN** the system computes the phase score as the arithmetic mean
- **AND** each rule score is constrained to `0..100`

## MODIFIED Requirements

### Requirement: Sidebar Menu Renaming

The sidebar menu item labeled "数仓列表" MUST be renamed to "数据工程".

#### Scenario: Sidebar shows renamed menu item

- **WHEN** the user views the sidebar
- **THEN** the menu item text is "数据工程"
