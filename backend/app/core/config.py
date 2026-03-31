from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Aqbobek Backend"
    app_version: str = "0.1.0"
    api_prefix: str = "/api"
    cors_origins: list[str] = ["http://localhost:3000"]
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
