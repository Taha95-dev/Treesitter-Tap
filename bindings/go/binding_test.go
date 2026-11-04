package tree_sitter_tap_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tap "github.com/tree-sitter/tree-sitter-tap/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tap.Language())
	if language == nil {
		t.Errorf("Error loading tap colorscheme grammar")
	}
}
