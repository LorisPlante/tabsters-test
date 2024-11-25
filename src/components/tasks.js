import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [alphabeticalOrder, setAlphabeticalOrder] = useState([false]);

  useEffect(() => {
    fetch("/tabsters.json")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      });
  }, []);

  // Fonction pour trier les tâches par ordre alphabétique
  const sortTasks = () => {
    let sorted;
    if (alphabeticalOrder) {
      sorted = [...filteredTasks].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted = [...filteredTasks].sort((a, b) => a.id - b.id);
    }
    setFilteredTasks(sorted);
    setAlphabeticalOrder(!alphabeticalOrder); // Toggle l'ordre de tri après chaque tri
  };

  // Fonction pour filtrer les tâches par statut
  const filterTasks = (status) => {
    if (status === "All") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  // Fonction pour calculer la moyenne des progrès
  const calculateAverageProgress = () => {
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    const averageProgress = (totalProgress / tasks.length).toFixed(0);
    return <>{averageProgress}</>;
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestionnaire de tâches</h1>

      {/* Boutons d'actions */}
      <div className="mb-3 d-flex justify-content-between">
        <div>
          {alphabeticalOrder && (
            <button className="btn btn-primary mx-1" onClick={sortTasks}>
              Trier par ordre alphabétique
            </button>
          )}
          {!alphabeticalOrder && (
            <button className="btn btn-primary mx-1" onClick={sortTasks}>
              Trier par numéro
            </button>
          )}
          <button className="btn btn-info mx-1" onClick={() => filterTasks("All")}>
            Tout
          </button>
          <button className="btn btn-danger mx-1" onClick={() => filterTasks("To Do")}>
            À faire
          </button>
          <button className="btn btn-warning mx-1" onClick={() => filterTasks("In Progress")}>
            En cours
          </button>
          <button className="btn btn-success mx-1" onClick={() => filterTasks("Completed")}>
            Terminées
          </button>
        </div>

        {/* Moyenne des progrès */}
        <button className="btn disabled">
          <strong>Moyenne des progrès :</strong> {calculateAverageProgress()} %
        </button>
      </div>

      {/* Tableau des tâches */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Statut</th>
            <th>Progrès (%)</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.name}</td>
              <td>{task.status}</td>
              <td>{task.progress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    // The rest of the component remains unchanged
  );
};

export default TaskManager;
