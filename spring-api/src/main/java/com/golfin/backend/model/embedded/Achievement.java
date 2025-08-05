package com.golfin.backend.model.embedded;

public class Achievement {
    private String title;
    private String description;

    public Achievement() {}

    public Achievement(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Achievement)) return false;
        Achievement a = (Achievement) o;
        return title.equals(a.title); 
    }

    @Override
    public int hashCode() {
        return title.hashCode();
    }
}
