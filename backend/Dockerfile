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

ENV ASPNETCORE_URLS=http://+:5008
EXPOSE 5008

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
