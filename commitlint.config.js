import { RuleConfigSeverity } from "@commitlint/types"

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            [
                'add',
                'feat',
                'del',
                'fix',
                'chore',
                'docs'
            ]
        ]
    }
};
