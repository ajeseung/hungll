package repository

type GitHubActionTriggerRepository interface {
	TriggerWorkflow(repoUrl string, token string, workflowFileName string, ref string) error
}
