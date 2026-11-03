import { MultiPlatformAuditState } from '../types/audit';

export const SAMPLE_MULTI_AUDIT_DATA: MultiPlatformAuditState = {
  communityName: 'Belonging Builders Guild',
  auditorName: 'Alex Rivera (Lead Community Architect)',
  selectedPlatforms: ['Discord', 'Telegram'],
  activePlatform: 'Discord',
  customPlatformName: '',
  platformAudits: {
    Discord: {
      structure: {
        score: 4,
        checklist: {
          'Channel architecture is logical.': true,
          'Roles and permissions are clear.': true,
          'Onboarding is easy to follow.': true,
          'Important resources are accessible.': false,
        },
        notes:
          'Channels are logically categorised into #start-here, #general-discussions, and #working-groups. Roles are clearly displayed with colour hierarchies. Onboarding bot welcomes members effectively, though resources in #links-and-tools need a pinned table of contents.',
      },
      activity: {
        score: 3,
        checklist: {
          'Members participate regularly.': true,
          'Conversations have meaningful depth.': true,
          'Activity isn\'t dependent only on administrators.': false,
          'Members interact with one another.': true,
        },
        notes:
          'Consistent daily discussion during weekdays, but thread generation slows when community managers do not post prompts. Peer-to-peer interactions in #feedback-exchange are genuine. Need community-led ritual hosts.',
      },
      culture: {
        score: 4,
        checklist: {
          'Community identity is recognisable.': true,
          'Members understand shared norms.': true,
          'New members are welcomed.': true,
          'Members demonstrate mutual support.': true,
        },
        notes:
          'High warmth and empathy. Existing members proactively greet newcomers in #introductions without prompting. Inside humor and shared terminology are flourishing. Very low toxicity.',
      },
      content: {
        score: 3,
        checklist: {
          'Announcements are clear.': true,
          'Content is useful and relevant.': true,
          'Member-generated content is encouraged.': false,
          'Information is easy to find.': false,
        },
        notes:
          'Official weekly newsletters and AMAs have strong engagement. However, member showcase submissions are sporadic. Searchability is a known pain point—should institute a knowledge base or Notion directory.',
      },
      governance: {
        score: 4,
        checklist: {
          'Rules are clear and accessible.': true,
          'Moderator responsibilities are defined.': true,
          'Decisions are communicated.': true,
          'Conflict escalation is documented.': false,
        },
        notes:
          'Code of conduct is prominently pinned and acknowledged during onboarding. Mod team meets bi-weekly with transparent notes. Conflict escalation playbook exists informally but needs formal documentation.',
      },
    },
    Telegram: {
      structure: {
        score: 3,
        checklist: {
          'Channel architecture is logical.': true,
          'Roles and permissions are clear.': false,
          'Onboarding is easy to follow.': false,
          'Important resources are accessible.': true,
        },
        notes:
          'Topics feature is enabled and categorised into General, Announcements, and Q&A. However, bot permissions and moderator badges are inconsistent, causing confusion for new joins.',
      },
      activity: {
        score: 4,
        checklist: {
          'Members participate regularly.': true,
          'Conversations have meaningful depth.': true,
          'Activity isn\'t dependent only on administrators.': true,
          'Members interact with one another.': true,
        },
        notes:
          'Very active real-time chatter and mobile engagement across global time zones. Peer discussions flow naturally with low administrator intervention needed.',
      },
      culture: {
        score: 3,
        checklist: {
          'Community identity is recognisable.': true,
          'Members understand shared norms.': false,
          'New members are welcomed.': false,
          'Members demonstrate mutual support.': true,
        },
        notes:
          'High energy and mutual help, but fast chat flow causes new members to get overlooked. Need automated welcome bot with link to rules.',
      },
      content: {
        score: 2,
        checklist: {
          'Announcements are clear.': true,
          'Content is useful and relevant.': false,
          'Member-generated content is encouraged.': false,
          'Information is easy to find.': false,
        },
        notes:
          'Critical pain point: high noise-to-signal ratio. Key resources get buried rapidly in message feeds. Pinned message limit restricts archiving important guides.',
      },
      governance: {
        score: 3,
        checklist: {
          'Rules are clear and accessible.': true,
          'Moderator responsibilities are defined.': false,
          'Decisions are communicated.': true,
          'Conflict escalation is documented.': false,
        },
        notes:
          'Anti-spam bots manage basic phishing, but manual mod response to borderline conduct is ad-hoc without formal escalation steps.',
      },
    },
  },
};
