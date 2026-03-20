## ADDED Requirements

### Requirement: Create Structured Data Source

The system MUST allow users to create a structured data source record from the data source page.

#### Scenario: Create a draft data source

- **WHEN** the user submits the minimum required fields for a structured data source
- **THEN** the system creates a data source record
- **AND** the data source is shown with an initial status of `draft`

### Requirement: Test Connectivity Separately

The system MUST support connectivity testing as an explicit action separate from data source creation.

#### Scenario: Connectivity test succeeds

- **WHEN** the user triggers connectivity testing for a saved data source
- **THEN** the system records a test result for that data source
- **AND** the data source connection state is updated to indicate success
- **AND** the data source is not automatically marked as warehouse-ready unless later steps are completed
- **AND** the UI returns the result synchronously to the current page flow

#### Scenario: Connectivity test fails

- **WHEN** the user triggers connectivity testing and the test fails
- **THEN** the system records the failed result
- **AND** the data source remains unavailable for warehouse-ready use
- **AND** the UI returns the failure result synchronously to the current page flow

### Requirement: Manage Warehouse Creation Under a Data Source

The system MUST allow warehouse creation or registration within the context of a selected data source.

#### Scenario: Create warehouse entry after connectivity success

- **GIVEN** a data source has a successful connectivity result
- **WHEN** the user creates or registers a warehouse under that data source
- **THEN** the system stores the warehouse as a managed warehouse entry linked to the data source
- **AND** the warehouse remains in a non-ready state until department association is completed
- **AND** the warehouse is treated as a logical warehouse object rather than a physical database creation action

#### Scenario: One data source creates one warehouse

- **WHEN** the user completes warehouse creation from a data source configuration
- **THEN** the system creates exactly one logical warehouse object for that data source configuration
- **AND** the workflow does not allow one data source configuration to create multiple warehouses

### Requirement: Associate Warehouse With Department

The system MUST allow managed warehouses to be associated with a department before they become evaluation-ready.

#### Scenario: Complete department association

- **GIVEN** a warehouse has been created or registered under a data source
- **WHEN** the user completes the required department association
- **THEN** the system stores the association result
- **AND** the warehouse can transition to `ready` only if all required prior steps are complete

#### Scenario: Restrict warehouse to a single department

- **WHEN** the user associates a warehouse with a department
- **THEN** the system stores exactly one department association for that warehouse
- **AND** the UI does not allow multiple department bindings for the same warehouse

### Requirement: Use Configurable Department List

The system MUST use a separately maintained department list for warehouse association, while keeping display names consistent with the warehouse list domain.

#### Scenario: Select department from managed list

- **WHEN** the user associates a warehouse with a department
- **THEN** the selectable department options come from a separately maintained department list
- **AND** the selected department naming remains consistent with the department names used in warehouse management views

#### Scenario: Department list is read-only in workflow

- **WHEN** the user uses the data source workflow
- **THEN** the department list is provided as built-in configuration data
- **AND** the workflow does not expose department create, edit, or delete operations

### Requirement: Expose Connectivity Status On Managed Warehouse

The system MUST expose connectivity status as part of managed warehouse data shown in the data source workflow.

#### Scenario: Show warehouse connectivity status

- **GIVEN** a warehouse is managed under a data source
- **WHEN** the user views the warehouse within the data source workflow
- **THEN** the system shows the warehouse connectivity status as part of the warehouse data presentation

### Requirement: Use Warehouse As Primary Object After Creation

The system MUST treat the warehouse, rather than the data source, as the primary managed object after warehouse creation is completed.

#### Scenario: Post-creation views are warehouse-centric

- **GIVEN** a warehouse has already been created from a data source configuration
- **WHEN** the user enters subsequent management, listing, or evaluation-related views
- **THEN** the UI uses the warehouse as the primary object
- **AND** the data source is not presented as the primary management object in those views

#### Scenario: View data source summary from warehouse detail

- **GIVEN** a warehouse was created from a data source configuration
- **WHEN** the user views the warehouse detail
- **THEN** the UI shows the corresponding data source configuration summary for that warehouse

### Requirement: Restrict Evaluation To Ready Warehouses

The system MUST prevent warehouses from entering the evaluation flow before required onboarding steps are complete.

#### Scenario: Warehouse not ready for evaluation

- **GIVEN** a warehouse is missing connectivity success, creation, or department association requirements
- **WHEN** the user views warehouse management or evaluation entry points
- **THEN** the warehouse is not treated as evaluation-ready
- **AND** the UI prevents or disables direct evaluation start for that warehouse

#### Scenario: Warehouse without department association

- **GIVEN** a warehouse has not yet been associated with a department
- **WHEN** the user attempts to view or use evaluation entry points
- **THEN** the warehouse is excluded from the evaluation-ready set
