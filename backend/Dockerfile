# Etapa de compilação
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/backend.csproj backend/
RUN dotnet restore backend/backend.csproj

COPY backend/ backend/
WORKDIR /src/backend
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Etapa de execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Instala a dependência libgssapi exigida pelo Npgsql no Linux
RUN apt-get update && apt-get install -y --no-install-recommends libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*

ENV ASPNETCORE_URLS=http://+:5008
EXPOSE 5008

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
