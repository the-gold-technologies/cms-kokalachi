-- Home hero: the Travellers dropdown became "How are you travelling?" (Solo / Group / Custom).
-- Old default labels are replaced; anything an admin already customised is kept.
UPDATE "Section"
SET "content" = "content"
  || jsonb_build_object(
    'travellersLabel',
      CASE WHEN COALESCE("content"->>'travellersLabel', '') IN ('', 'Travellers')
        THEN 'Travelling' ELSE "content"->>'travellersLabel' END,
    'groupSizeTitle',
      CASE WHEN COALESCE("content"->>'groupSizeTitle', '') IN ('', 'Group Size')
        THEN 'How are you travelling?' ELSE "content"->>'groupSizeTitle' END,
    'customButtonText', COALESCE(NULLIF("content"->>'customButtonText', ''), 'Plan My Trip')
  )
  || CASE
    -- Old list had no keys ("1 Traveller", ...): swap in the three travel styles
    WHEN NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(
        CASE WHEN jsonb_typeof("content"->'travellerOptions') = 'array'
          THEN "content"->'travellerOptions' ELSE '[]'::jsonb END
      ) AS opt WHERE opt ? 'key'
    )
    THEN jsonb_build_object('travellerOptions', '[
      {"key": "solo", "label": "Solo", "desc": "Join a group trip on your own"},
      {"key": "group", "label": "Group", "desc": "With friends, a partner or family"},
      {"key": "custom", "label": "Custom", "desc": "A private trip on your own dates"}
    ]'::jsonb)
    ELSE '{}'::jsonb
  END
WHERE "type" = 'HeroSection'
  AND "pageId" IN (SELECT "id" FROM "Page" WHERE "slug" = 'home');
