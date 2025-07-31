package service

import (
	"snack/github_action_trigger/repository"
	"strings"
)


type GitHubActionTriggerServiceImpl struct {
	Repo repository.GitHubActionTriggerRepository
}

// NewGitHubActionTriggerServiceImpl 생성자 함수
func NewGitHubActionTriggerServiceImpl(repo repository.GitHubActionTriggerRepository) GitHubActionTriggerService {
	return &GitHubActionTriggerServiceImpl{Repo: repo}
}

// GetTriggers 구현
func (s *GitHubActionTriggerServiceImpl) RunWorkflow(repoUrl string, token string, workflowFileName string) error {
	var ref string

	if strings.Contains(repoUrl, "snack-nuxt-frontend") {
		ref = "demo"
	} else {
		ref = "main"
	}
	return s.Repo.TriggerWorkflow(repoUrl, token, workflowFileName, ref)
}
